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