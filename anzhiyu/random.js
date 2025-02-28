var posts=["2025/01/11/conda常用命令/","2024/12/10/docker使用/","2024/12/18/git的使用/","2024/12/08/排序算法/","2025/01/08/vim使用技巧/","2024/12/10/vscode配置/","2024/12/05/散列查找/","2025/01/16/数字图像处理基础/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };