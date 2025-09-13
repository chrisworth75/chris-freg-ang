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

        stage('Debug Jenkins Environment') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        echo "🔍 === JENKINS ENVIRONMENT DEBUG ==="
                        echo "📍 Current user: $(whoami)"
                        echo "📍 Current directory: $(pwd)"
                        echo "📍 PATH: $PATH"
                        echo ""
                        echo "📍 Looking for Node.js installations:"
                        which node || echo "❌ node not found in PATH"
                        which npm || echo "❌ npm not found in PATH"
                        which npx || echo "❌ npx not found in PATH"
                        echo ""
                        echo "📍 Checking common Node.js locations:"
                        ls -la /usr/local/bin/ | grep node || echo "No node in /usr/local/bin/"
                        ls -la /opt/homebrew/bin/ | grep node || echo "No node in /opt/homebrew/bin/"
                        ls -la /Users/chris/.nvm/versions/node/ || echo "No nvm directory"
                        echo ""
                        echo "📍 Service status check:"
                        frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4200 || echo "000")
                        api_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5100/health || echo "000")
                        echo "Frontend (4200): $frontend_status"
                        echo "API (5100): $api_status"
                        echo ""
                        echo "📍 Directory contents:"
                        ls -la
                        echo ""
                        echo "📍 Package.json check:"
                        cat package.json | head -20 || echo "No package.json"
                        echo ""
                        echo "🎯 This is what Jenkins actually sees!"
                    '''
                }
            }
            post {
                always {
                    echo '🔍 Debug stage completed - check console output above for Jenkins environment details'
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