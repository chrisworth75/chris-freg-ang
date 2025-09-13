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
                        for i in {1..30}; do
                            if curl -f -s http://localhost:4200 > /dev/null 2>&1 && curl -f -s http://localhost:5100/health > /dev/null 2>&1; then
                                echo "✅ Both services are ready after $((i * 5)) seconds"
                                break
                            elif [ $i -eq 30 ]; then
                                echo "❌ Services failed to become ready after 150 seconds"
                                echo "Frontend status:"
                                curl -I http://localhost:4200 || true
                                echo "API status:"
                                curl -I http://localhost:5100/health || true
                                exit 1
                            else
                                echo "⏳ Attempt $i/30: Services not ready, waiting 5s..."
                                sleep 5
                            fi
                        done

                        # Run Playwright tests in Docker container
                        docker run --rm \\
                            --network host \\
                            -v "$(pwd):/workspace" \\
                            --workdir /workspace \\
                            -e CI=true \\
                            mcr.microsoft.com/playwright:v1.40.0-jammy sh -c "
                                npm ci
                                npx playwright install --with-deps chromium
                                mkdir -p test-results
                                npx playwright test --reporter=html,junit --output-dir=test-results
                            "
                    '''
                }
            }
            post {
                always {
                    // Archive test results and screenshots
                    publishTestResults testResultsPattern: 'test-results/results.xml'
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                }
                success {
                    echo '✅ All E2E tests passed!'
                }
                failure {
                    echo '❌ E2E tests failed - check test results and screenshots'
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