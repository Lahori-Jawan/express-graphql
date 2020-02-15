# Please follow these steps to run the app in each environment

## Node
```
git clone https://github.com/Lahori-Jawan/express-graphql.git

yarn install  // npm install

yarn generate

yarn dev
```

## Docker

`docker build -t ex-graphql .`

`docker run --rm -p 4000:4000 ex-graphql`


## Kubernetes (k8s)

`kubectl apply -f ./k8s/app.yaml`


## How to interact with app

Please see `guide` directory for visual assistance.
