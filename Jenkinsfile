pipeline {
  agent any

  environment {
    CI = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Check npm') {
                steps {
                    script {
                        echo "Checking environment variables and npm location"
                    }
                    sh '''
                        echo "PATH: $PATH"
                        which npm || echo "npm not found"
                        npm -v || echo "npm is not installed or not in PATH"
                    '''
                }
            }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build Angular App') {
      steps {
        sh 'npm run build'
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
      }
    }
  }
}
