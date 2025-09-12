
// Jenkinsfile in chris-freg repository
pipeline {
    agent any

    environment {
        REGISTRY = 'localhost:5000'
        IMAGE_NAME = 'chris-freg-frontend'
        NODE_VERSION = '18'
    }

    tools {
        nodejs "${NODE_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'node --version && npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Test') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'lint-results',
                                reportFiles: '*.html',
                                reportName: 'ESLint Report'
                            ])
                        }
                    }
                }
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test -- --watch=false --browsers=ChromeHeadless --code-coverage'
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results.xml'
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build -- --configuration production'
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
                    sh 'curl -f http://localhost:4200 || exit 1'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Frontend pipeline completed successfully!'
        }
        failure {
            echo 'Frontend pipeline failed!'
        }
    }
}
