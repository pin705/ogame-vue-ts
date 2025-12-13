package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os/exec"
	"runtime"
	"strings"
	"time"
)

//go:embed docs/*
var content embed.FS

func main() {
	// 1. 获取 docs 子目录的 FS 句柄
	distFS, _ := fs.Sub(content, "docs")

	// 2. 创建静态资源服务
	fileServer := http.FileServer(http.FS(distFS))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/")

		// 如果访问根路径或文件不存在，则回退到 index.html (支持 SPA)
		_, err := distFS.Open(path)
		if path == "" || err != nil {
			// 读取 index.html 内容
			indexData, err := fs.ReadFile(distFS, "index.html")
			if err != nil {
				http.Error(w, "Index not found", http.StatusNotFound)
				return
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			http.ServeContent(w, r, "index.html", time.Now(), strings.NewReader(string(indexData)))
			return
		}

		// 正常提供静态文件
		fileServer.ServeHTTP(w, r)
	})

	// 3. 自动寻找可用端口并获取局域网 IP
	listener, _ := net.Listen("tcp", "0.0.0.0:0")
	port := listener.Addr().(*net.TCPAddr).Port
	localUrl := fmt.Sprintf("http://localhost:%d", port)
	lanUrl := fmt.Sprintf("http://%s:%d", getLocalIp(), port)

	fmt.Println("-----------------------------------")
	fmt.Printf("🚀 OGame 程序已启动！\n")
	fmt.Printf("🔗 本地访问: %s\n", localUrl)
	fmt.Printf("🌐 局域网访问: %s\n", lanUrl)
	fmt.Println("-----------------------------------")

	// 4. 自动打开浏览器
	go openBrowser(localUrl)

	// 5. 启动服务
	http.Serve(listener, nil)
}

func getLocalIp() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return "localhost"
	}
	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return "localhost"
}

func openBrowser(url string) {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start", url}
	case "darwin":
		cmd = "open"
		args = []string{url}
	default: // linux
		cmd = "xdg-open"
		args = []string{url}
	}
	exec.Command(cmd, args...).Start()
}