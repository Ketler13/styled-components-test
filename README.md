# Test repo to reproduce possible memory leak in styled-components

This repo was created to show possible memory leak during rendering GlobalStyle component in styled-components package.

Preconditions: next.js + styled-components + react-apollo.

Latest code of styled-components(5.0 version) is placed in vendor/styled/components. There are a few additional console.logs.
This file is taken from the styled-components/dist/styled-components.cjs.js.

This problem is related to a coommit https://github.com/styled-components/styled-components/commit/aca9186920dd4adddb44b76063b75ab1147b480a .
There was new counter mechanism introduced to improve SSR handling of multiple instances of global styles components.
But under some conditions this mechanism can be broken.


There are 2 logs added:
1 - to detect size of Uint32Array created for groups (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/sheet/GroupedTag.js#L41)
2 - to detect istance counter value (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/constructors/createGlobalStyle.js#L30)

To reproduse issue, please install all modules and run ```npm run dev```. When server is started, please make big number of requests to index page. Script for loading the server from terminal
```for ((i=1;i<=5000;i++)); do   curl -v --header "Connection: keep-alive" "localhost:3000"; done```

You will see incrementing of global style instance number. This is used in registering new id of the group (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/models/GlobalStyle.js#L45)

Then this id will be passed to the GroupIDAllocator and if counter is incremented on each request - created id will never be found in the registry and total groups counter will be increased (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/sheet/GroupIDAllocator.js#L18)

Then this counter is used when new rules inserted - https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/sheet/Sheet.js#L94

When if condition (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/sheet/GroupedTag.js#L36) is satisfied, new Uint32Array is created (https://github.com/styled-components/styled-components/blob/147b0e9a1f10786551b13fd27452fcd5c678d5e0/packages/styled-components/src/sheet/GroupedTag.js#L39)

This bitwise operation will return next results under such conditions:
```const newSize = BASE_SIZE << ((group / BASE_SIZE) | 0);```
When ```group``` equals 5362 (5632 requests to the server), ```newSize``` will be 1073741824.
When ```group``` equals 5888 (5632 requests to the server), ```newSize``` will be -2147483648 (Range error comes).

I added deallocating method for the global stylesheet (it decrements number of instances). To start this branch, please run 
```dev-deallocate```
It will call deallocateGSInstance method (definition is on 545 line in vendor/styles-components, call on 1660 line).
I understand that the place of calling is totally incorrect and has to be placed.
