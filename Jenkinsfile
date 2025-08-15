pipeline {
  agent any

  tools {
    nodejs "node18"
  }

  environment {
    CI = 'true'
    IMAGE_NAME = "chris-freg-frontend"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
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

    stage('Build Docker Image') {
      steps {
        sh """
          docker build -t ${IMAGE_NAME}:latest .
        """
      }
    }

    
  }

  post {
    always {
      echo "Cleaning workspace"
      cleanWs()
    }
  }
}

