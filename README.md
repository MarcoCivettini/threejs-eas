## Development environment
1. Build it and name it 
    ```
    docker build -t <dev-env name> .
    ```

2. Run it 
    ```
    docker run --rm -it -p 3000:3000 -v ${PWD}/:/app <dev-env name> ash
    ```

    As an example, `docker run --rm -it -p 3000:3000 -v ${PWD}:/app/ swordgen_dev ash`


## Development without docker

1. Move into `threejs-eas/src/src` folder
```sh
cd src
```

2. First time you must install node_modules
```sh
npm install
```

3. Run dev environment with the command above
```sh
npm run dev
```