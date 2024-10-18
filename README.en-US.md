## Project Links

| Project | Gitee                                                        | Github                                                       | GitCode                                                      |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Frontend | [vue3-element-admin](https://gitee.com/youlaiorg/vue3-element-admin) | [vue3-element-admin](https://github.com/youlaitech/vue3-element-admin) | [vue3-element-admin](https://gitcode.net/youlai/vue3-element-admin) |
| Backend | [youlai-boot](https://gitee.com/youlaiorg/youlai-boot)       | [youlai-boot](https://github.com/haoxianrui/youlai-boot.git) | [youlai-boot](https://gitcode.net/youlai/youlai-boot)        |

## Environment Setup

| Environment         | Name and Version                                             | Download Link                                               |
| -------------------- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| **Development Tool** | VSCode                                                       | [Download](https://code.visualstudio.com/Download)           |
| **Runtime Environment** | Node ≥18                                                    | [Download](http://nodejs.cn/download)                        |


## Project Setup

```bash
# Clone the repository
git clone https://gitee.com/youlaiorg/vue3-element-admin.git

# Change directory
cd vue3-element-admin

# Install pnpm
npm install pnpm -g

# Install dependencies
pnpm install

# Start the project
pnpm run dev
```

## Project Deployment

```bash
# Build the project
pnpm run build:prod

# Upload files to the remote server
Copy the files generated in the `dist` directory to the `/usr/share/nginx/html` directory.

# nginx.cofig configuration
server {
	listen     80;
	server_name  localhost;
	location / {
			root /usr/share/nginx/html;
			index index.html index.htm;
	}
	# Reverse proxy configuration
	location /prod-api/ {
			proxy_pass http://vapi.youlai.tech/; # Replace vapi.youlai.tech with your backend API address
	}
}
```

## Local Mock

The project supports both online API and local mock API. By default, it uses the online API. If you want to switch to the mock API, modify the value of `VITE_MOCK_DEV_SERVER` in the `.env.development` file to `true`.

## Backend API

> If you have a basic understanding of Java development, follow these steps to convert online API to local backend API and set up a full-stack development environment.

1. Get the backend source code based on `Java` and `SpringBoot` from [youlai-boot](https://gitee.com/youlaiorg/youlai-boot.git).
2. Follow the instructions in the backend project's README.md to set up the local environment.
3. Modify the value of `VITE_APP_API_URL` in the `.env.development` file to `http://localhost:8989`, replacing it with the backend API URL.

## Notes

- **Auto import plugin is disabled by default**

  Component type declarations have been automatically generated for the template project. If you add and use new components, follow the instructions in the screenshot to enable automatic generation. After automatic generation is complete, remember to set it back to `false` to avoid conflicts.

  ![](https://foruda.gitee.com/images/1687755823137387608/412ea803_716974.png)

- **Blank page when accessing the project**

  Try upgrading your browser, as older browser engines may not support certain new JavaScript syntax, such as optional chaining operator `?.`.

- **Red highlight on project components, functions, and imports**

  Restart VSCode to try again.

- **Other issues**

  If you have any other issues or suggestions, please open an [issue](https://gitee.com/youlaiorg/vue3-element-admin/issues/new).

## Project Documentation

- [Building a Backend Management System from Scratch with Vue3, Vite, TypeScript, and Element-Plus](https://blog.csdn.net/u013737132/article/details/130191394)

- [ESLint+Prettier+Stylelint+EditorConfig for Standardized and Unified Frontend Code Style](https://blog.csdn.net/u013737132/article/details/130190788)
- [Git Commit Conventions with Husky, Lint-staged, Commitlint, Commitizen, and cz-git](https://blog.csdn.net/u013737132/article/details/130191363)

