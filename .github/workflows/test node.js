name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Use Node.js 14.x
      uses: actions/setup-node@v2
      with:
        node-version: '14.x'

    - name: Install dependencies
      run: npm install

    - name: Run tests with coverage
      run: |
        npm run test
        npm run coverage