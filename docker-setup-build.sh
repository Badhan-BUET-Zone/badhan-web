docker build \
  --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t badhan-web-docker-setup - < ./docker-setup.Dockerfile