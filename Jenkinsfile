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
                    sh '''
                        echo "🧪 Running E2E tests with Playwright (direct execution)..."

                        # Wait for both frontend and API to be ready
                        echo "⏳ Waiting for services to be ready..."
                        for i in {1..30}; do
                            frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 || echo "000")
                            api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5100/health || echo "000")

                            echo "🔍 Attempt $i/30: Frontend=$frontend_status, API=$api_status"

                            if [ "$frontend_status" = "200" ] && [ "$api_status" = "200" ]; then
                                echo "✅ Both services are ready"
                                break
                            elif [ $i -eq 30 ]; then
                                echo "❌ Services failed to become ready after 150 seconds"
                                exit 1
                            else
                                sleep 5
                            fi
                        done

                        echo "📦 Installing npm dependencies..."
                        npm ci --production=false

                        echo "🎭 Installing Playwright browsers..."
                        npx playwright install chromium --with-deps

                        echo "📁 Creating output directories..."
                        mkdir -p test-results playwright-report

                        echo "🧪 Running Playwright tests..."
                        export CI=true
                        npx playwright test --config=playwright.config.ts --reporter=line,junit:test-results/results.xml,html:playwright-report/

                        echo "✅ E2E tests completed successfully"
                    '''
                }
            }
            post {
                always {
                    // Archive test results and reports
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
                }
                failure {
                    echo '❌ E2E tests failed - check test results and reports'
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