pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Test') {
            steps {
                sh '''
                docker run --rm -v $PWD/backend:/src:ro node:20-alpine sh -c 'cp -r /src /app && cd /app && npm install --no-audit --no-fund && npm test'
                '''
            }
        }
        stage('Build Images') {
            steps {
                sh '''
                docker build -t event-backend:$BUILD_NUMBER ./backend
                docker build -t event-frontend:$BUILD_NUMBER ./frontend
                '''
            }
        }
        stage('Load into Minikube') {
            steps {
                sh '''
                minikube image load event-backend:$BUILD_NUMBER
                minikube image load event-frontend:$BUILD_NUMBER
                '''
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh 'sed "s/__TAG__/$BUILD_NUMBER/g" k8s/app.yaml | kubectl apply -f -'
            }
        }
        stage('Verify') {
            steps {
                sh '''
                kubectl rollout status deployment/mongo --timeout=240s
                kubectl rollout status deployment/backend --timeout=240s
                kubectl rollout status deployment/frontend --timeout=240s
                kubectl get pods
                sleep 5
                curl -f http://localhost/api/events
                '''
            }
        }
    }
    post {
        success { echo 'Deployed successfully' }
        failure { echo 'Pipeline failed - check the stage logs' }
    }
}
