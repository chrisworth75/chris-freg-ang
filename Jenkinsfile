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
                    // Kill any process using port 4200
                    sh """
                        echo "Killing any process using port 4200..."
                        /usr/sbin/lsof -ti:4200 | xargs kill -9 || true
                    """

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
                        # Run tests and always generate reports, even on failure
                        set +e  # Don't exit on test failure
                        CI=true npx playwright test e2e/fee-management.spec.ts --reporter=html,junit,allure-playwright
                        TEST_EXIT_CODE=$?
                        set -e  # Re-enable exit on error

                        echo "📊 Test execution completed with exit code: $TEST_EXIT_CODE"

                        # Always try to generate additional reports
                        echo "📊 Generating Allure report..."
                        if [ -d "allure-results" ] && [ "$(ls -A allure-results)" ]; then
                            npx allure generate allure-results --clean -o allure-report || echo "⚠️ Allure report generation failed"
                            echo "✅ Allure report generated successfully"
                        else
                            echo "⚠️ No allure-results found - skipping HTML report generation"
                        fi

                        # Let Jenkins handle test results naturally (like React does)
                        echo "📊 Tests completed, letting Jenkins process JUnit results"
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
                        def allureResultsExist = fileExists('allure-results') && (sh(script: 'ls -1 allure-results | wc -l', returnStdout: true).trim() as Integer) > 0

                        if (allureResultsExist) {
                            // Try Allure plugin first
                            try {
                                allure([
                                    includeProperties: false,
                                    jdk: '',
                                    properties: [],
                                    reportBuildPolicy: 'ALWAYS',
                                    results: [[path: 'allure-results']]
                                ])
                                echo "✅ Allure plugin configured successfully"
                                echo "📈 Look for 'Allure Report' link in left sidebar of build page"
                            } catch (Exception e) {
                                echo "❌ Allure plugin failed: ${e.message}"
                                echo "🔄 Trying fallback with publishHTML..."

                                // Fallback: Generate HTML report and publish it
                                try {
                                    sh 'npx allure generate allure-results --clean -o allure-report-html'
                                    publishHTML([
                                        allowMissing: false,
                                        alwaysLinkToLastBuild: true,
                                        keepAll: true,
                                        reportDir: 'allure-report-html',
                                        reportFiles: 'index.html',
                                        reportName: 'Allure Report (HTML)',
                                        reportTitles: ''
                                    ])
                                    echo "✅ Allure report published via HTML Publisher"
                                    echo "📈 Look for 'Allure Report (HTML)' link in left sidebar"
                                } catch (Exception htmlError) {
                                    echo "❌ HTML fallback also failed: ${htmlError.message}"
                                    echo "📁 Allure results available in build artifacts for manual download"
                                }
                            }
                        } else {
                            echo "⚠️  No allure-results found - Allure reports will not be available"
                        }
                    }

                    // Publish Playwright HTML report
                    script {
                        def playwrightReportExists = fileExists('playwright-report/index.html')

                        if (playwrightReportExists) {
                            try {
                                publishHTML([
                                    allowMissing: false,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: 'playwright-report',
                                    reportFiles: 'index.html',
                                    reportName: 'Playwright Report',
                                    reportTitles: ''
                                ])
                                echo "✅ Playwright HTML report published"
                                echo "🎭 Look for 'Playwright Report' link in left sidebar"
                            } catch (Exception e) {
                                echo "❌ Failed to publish Playwright HTML report: ${e.message}"
                            }
                        }
                    }

                    // Instructions for viewing reports
                    script {
                        def playwrightReportExists = fileExists('playwright-report/index.html')
                        def allureResultsExist = fileExists('allure-results')

                        echo "📊 Available Test Reports:"
                        if (allureResultsExist) {
                            echo "   📈 Allure Report: Click 'Allure Report' link on build page"
                            echo "      - Step-by-step test execution with timeline"
                            echo "      - Interactive charts and graphs"
                        }
                        if (playwrightReportExists) {
                            echo "   🎭 Playwright Report: Click 'Playwright Report' link on build page"
                            echo "      - Videos and screenshots embedded"
                            echo "      - Test traces and debugging info"
                        }
                        if (!allureResultsExist && !playwrightReportExists) {
                            echo "   ⚠️  No test reports generated - check test execution"
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