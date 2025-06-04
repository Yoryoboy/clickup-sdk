@echo off
echo Building clickup-sdk package...

if not exist dist mkdir dist
xcopy /E /I /Y src dist
echo export { default } from "./core/ClickUp.js"; > dist\index.js

echo Build completed successfully!
