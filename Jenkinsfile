
pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    CI = 'true'
    NG_CLI_ANALYTICS = 'false'
    IMAGE_NAME = 'chris-freg-frontend'
    IMAGE_TAG  = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image (multi-stage)') {
      steps {
          sh '''
            set -eux
            docker version
            docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
          '''
        }
      }
    }

    stage('(Optional) Save dist artifact from image') {
      steps {
          sh '''
            set -eux
            id=$(docker create ${IMAGE_NAME}:${IMAGE_TAG})
            docker cp "$id":/usr/share/nginx/html ./dist
            docker rm "$id"
          '''
        }
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Deploy (local)') {
      when { branch 'main' } // remove if you want every branch to deploy
      steps {
          sh '''
            set -eux
            CONTAINER=${IMAGE_NAME}

            # stop & remove any existing container
            docker rm -f "$CONTAINER" || true

            # run new container on 8081 -> 80 (nginx)
            docker run -d --name "$CONTAINER" \
              -p 8081:80 \
              --restart unless-stopped \
              ${IMAGE_NAME}:latest

            # show status + quick smoke check
            docker ps --filter "name=$CONTAINER"
            sleep 2
            (curl -fsS http://localhost:8081 >/dev/null && echo "Smoke check OK") || echo "Heads up: curl check failed (maybe curl not installed?)"
          '''
        }
      }
    }
  }

  post {
    always {
      echo 'Cleaning workspace'
      cleanWs()
    }
  }
}
