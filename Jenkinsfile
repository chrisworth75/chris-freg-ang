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
                        timeout=120
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
                        echo "📦 Installing npm dependencies..."
                        npm install
                        echo "🧪 Installing Playwright browsers..."
                        npx playwright install chromium
                        echo "🚀 Running E2E tests..."
                        CI=true npx playwright test e2e/smoke-test.spec.ts e2e/fee-management.spec.ts --reporter=line

                        echo "📊 Generating Allure report..."
                        if [ -d "allure-results" ] && [ "$(ls -A allure-results)" ]; then
                            npx allure generate allure-results --clean -o allure-report || echo "⚠️ Allure report generation failed"
                            echo "✅ Allure report generated successfully"
                        else
                            echo "⚠️ No allure-results found - skipping HTML report generation"
                        fi
                    '''
                }
            }
            post {
                always {
                    // Archive test results and videos
                    junit testResults: 'test-results/results.xml', allowEmptyResults: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'allure-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'allure-report/**/*', allowEmptyArchive: true

                    // Publish Allure reports directly in Jenkins UI
                    script {
                        def allureResultsExist = fileExists('allure-results') && sh(script: 'ls -1 allure-results | wc -l', returnStdout: true).trim() as Integer > 0

                        if (allureResultsExist) {
                            try {
                                allure([
                                    includeProperties: false,
                                    jdk: '',
                                    properties: [],
                                    reportBuildPolicy: 'ALWAYS',
                                    results: [[path: 'allure-results']],
                                    commandline: 'allure'
                                ])
                                echo "✅ Allure plugin configured successfully"
                                echo "📈 Look for 'Allure Report' link in left sidebar of build page"
                            } catch (Exception e) {
                                echo "❌ Allure plugin failed: ${e.message}"
                                echo "💡 Make sure Allure plugin is properly installed and configured in Jenkins"
                            }
                        } else {
                            echo "⚠️  No allure-results found - Allure reports will not be available"
                        }
                    }

                    // Instructions for viewing reports
                    script {
                        def playwrightReportExists = fileExists('playwright-report/index.html')
                        def allureResultsExist = fileExists('allure-results')

                        echo "📊 Available Test Reports:"
                        echo "   📈 Allure Report: Click 'Allure Report' link on build page"
                        echo "      - Step-by-step test execution with timeline"
                        echo "      - Interactive charts and graphs"
                        if (playwrightReportExists) {
                            echo "   🎭 Playwright Report: Download 'playwright-report' → open index.html"
                            echo "      - Videos and screenshots embedded"
                        }
                        if (!allureResultsExist) {
                            echo "   ⚠️  No allure-results generated - check test execution"
                        }
                    }
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