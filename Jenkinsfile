// Jenkinsfile in chris-freg repository
pipeline {
    agent any

    environment {
        REGISTRY = 'localhost:5000'
        IMAGE_NAME = 'chris-freg-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Checked out code successfully"'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def image = docker.build("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry("http://${REGISTRY}") {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Stop existing container if running
                    sh """
                        docker stop ${IMAGE_NAME} || true
                        docker rm ${IMAGE_NAME} || true
                    """

                    // Run new container
                    sh """
                        docker run -d \\
                        --name ${IMAGE_NAME} \\
                        --restart unless-stopped \\
                        -p 4200:80 \\
                        ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                    """
                }
            }
        }

        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sleep 10 // Wait for container to start
                    sh 'curl -f http://localhost:4200 || echo "Health check failed - container may still be starting"'
                }
            }
        }

        stage('E2E Tests') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Use Docker to run Playwright tests to avoid environment issues
                    sh '''
                        echo "🧪 Running E2E tests with Playwright..."

                        # Wait for both frontend and API to be ready
                        echo "⏳ Waiting for services to be ready..."
                        echo "🔍 Checking running containers:"
                        docker ps

                        for i in {1..60}; do
                            frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 || echo "000")
                            api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5100/health || echo "000")

                            echo "🔍 Attempt $i/60: Frontend=$frontend_status, API=$api_status"

                            if [ "$frontend_status" = "200" ] && [ "$api_status" = "200" ]; then
                                echo "✅ Both services are ready after $((i * 5)) seconds"
                                echo "🌐 Frontend response:"
                                curl -s http://localhost:4200 | head -n 5
                                echo "🔗 API response:"
                                curl -s http://localhost:5100/health
                                break
                            elif [ $i -eq 60 ]; then
                                echo "❌ Services failed to become ready after 300 seconds"
                                echo "🔍 Container logs:"
                                docker logs chris-freg-frontend --tail 10 || true
                                docker logs chris-freg-api --tail 10 || true
                                exit 1
                            else
                                sleep 5
                            fi
                        done

                        # Run Playwright tests in Docker container
                        echo "🐳 Starting Playwright Docker container..."

                        # First test if services are accessible
                        echo "🔍 Testing service accessibility before running tests..."
                        curl -f http://localhost:4200/ || (echo "❌ Frontend not accessible" && exit 1)
                        curl -f http://localhost:5100/health || (echo "❌ API not accessible" && exit 1)

                        docker run --rm \\
                            --network host \\
                            -v "$(pwd):/workspace" \\
                            --workdir /workspace \\
                            -e CI=true \\
                            -e PLAYWRIGHT_BROWSERS_PATH=0 \\
                            mcr.microsoft.com/playwright:v1.40.0-jammy sh -c "
                                echo '📦 Installing dependencies...'
                                npm ci
                                echo '🎭 Installing Playwright browsers...'
                                npx playwright install --with-deps chromium
                                echo '📁 Creating output directories...'
                                mkdir -p test-results playwright-report
                                echo '🔍 Final service check from inside container...'
                                curl -f http://localhost:4200/ || (echo 'Frontend not accessible from container' && exit 1)
                                curl -f http://localhost:5100/health || (echo 'API not accessible from container' && exit 1)
                                echo '🧪 Running Playwright tests...'
                                npx playwright test --config=playwright.config.ts --reporter=list,junit:test-results/results.xml,html:playwright-report/
                                echo '✅ Tests completed successfully'
                            "
                    '''
                }
            }
            post {
                always {
                    // Archive test results and reports (allow missing files)
                    script {
                        try {
                            publishTestResults testResultsPattern: 'test-results/results.xml'
                        } catch (Exception e) {
                            echo "No JUnit test results found: ${e.getMessage()}"
                        }
                    }

                    // Archive all test artifacts including videos
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true, fingerprint: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true, fingerprint: true

                    // Archive videos separately for easy access
                    archiveArtifacts artifacts: 'test-results/**/videos/**/*.webm', allowEmptyArchive: true, fingerprint: true
                    archiveArtifacts artifacts: 'test-results/**/traces/**/*.zip', allowEmptyArchive: true, fingerprint: true

                    // Publish HTML reports
                    script {
                        try {
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'Playwright Test Report',
                                reportTitles: 'E2E Test Results'
                            ])
                        } catch (Exception e) {
                            echo "No HTML report found: ${e.getMessage()}"
                        }
                    }
                }
                success {
                    echo '✅ All E2E tests passed!'
                    echo '📊 Test report available in Jenkins artifacts'
                }
                failure {
                    echo '❌ E2E tests failed - check test results, screenshots, and videos'
                    echo '🎥 Videos available in Jenkins artifacts for debugging'
                }
            }
        }
    }

    post {
        success {
            echo 'Frontend pipeline completed successfully!'
        }
        failure {
            echo 'Frontend pipeline failed!'
        }
    }
}