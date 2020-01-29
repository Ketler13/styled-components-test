# Test repo to reproduce possible memory leak in styled-components

Script for loading the server from terminal
```for ((i=1;i<=5000;i++)); do   curl -v --header "Connection: keep-alive" "localhost:3000"; done```