
pipeline {
  agent any

  environment {
    CI = 'true'
    IMAGE_NAME = "chris-freg-frontend"
    IMAGE_TAG  = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build Docker Image (multi-stage)') {
      steps {
        sh 'docker version' // sanity check perms
        sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .'
      }
    }

    stage('(Optional) Save dist artifact from image') {
      steps {
        // pulls files out of the build stage output, if you want them archived in Jenkins
        sh '''
          id=$(docker create ${IMAGE_NAME}:${IMAGE_TAG})
          docker cp $id:/usr/share/nginx/html ./dist
          docker rm $id
        '''
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
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
