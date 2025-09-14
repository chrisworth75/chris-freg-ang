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
                    // Wait for services to be ready
                    sh '''
                        echo "🔄 Waiting for services to be ready..."
                        timeout=60
                        while [ $timeout -gt 0 ]; do
                            frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 || echo "000")
                            api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5100/health || echo "000")

                            if [ "$frontend_status" = "200" ] && [ "$api_status" = "200" ]; then
                                echo "✅ Both services are ready"
                                break
                            fi

                            echo "⏳ Frontend: $frontend_status, API: $api_status - waiting..."
                            sleep 2
                            timeout=$((timeout-2))
                        done

                        if [ $timeout -le 0 ]; then
                            echo "❌ Services failed to start within timeout"
                            exit 1
                        fi
                    '''

                    // Run E2E tests with Node.js from nvm
                    sh '''
                        export PATH="/Users/chris/.nvm/versions/node/v18.19.1/bin:$PATH"
                        echo "📍 Node.js version: $(node --version)"
                        echo "📍 NPM version: $(npm --version)"
                        echo "🧪 Installing Playwright browsers..."
                        npx playwright install chromium
                        echo "🚀 Running E2E tests..."
                        CI=true npx playwright test --reporter=line
                    '''
                }
            }
            post {
                always {
                    // Archive test results and videos
                    publishTestResults testResultsPattern: 'test-results/results.xml'
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                }
                failure {
                    echo '❌ E2E tests failed - check artifacts for details'
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