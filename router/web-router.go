package router

import (
	"embed"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/controller"
	"github.com/QuantumNous/new-api/middleware"
	"github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func SetWebRouter(router *gin.Engine, buildFS embed.FS, indexPage []byte, lzclawPage []byte, lzclawQRCode []byte) {
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	router.Use(middleware.GlobalWebRateLimit())
	router.Use(middleware.Cache())
	router.StaticFS("/public", gin.Dir(resolveRuntimeDirPath("public"), false))
	router.GET("/lzclaw.html", func(c *gin.Context) {
		serveLzclawHTML(c, lzclawPage)
	})
	// router.GET("/qrcode.jpg", func(c *gin.Context) {
	// 	serveLzclawQRCode(c, lzclawQRCode)
	// })
	router.GET("/download/lzclaw-setup.exe", func(c *gin.Context) {
		serveLzclawDownload(c)
	})
	router.Use(static.Serve("/", common.EmbedFolder(buildFS, "web/dist")))
	router.NoRoute(func(c *gin.Context) {
		c.Set(middleware.RouteTagKey, "web")
		if strings.HasPrefix(c.Request.RequestURI, "/v1") || strings.HasPrefix(c.Request.RequestURI, "/api") || strings.HasPrefix(c.Request.RequestURI, "/assets") {
			controller.RelayNotFound(c)
			return
		}
		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", indexPage)
	})
}

func loadRuntimeHTML(fileName string, fallback []byte) []byte {
	return loadRuntimeFile(fileName, fallback)
}

func loadRuntimeFile(fileName string, fallback []byte) []byte {
	if filePath, err := resolveRuntimeFilePath(fileName); err == nil {
		if data, readErr := os.ReadFile(filePath); readErr == nil {
			return data
		}
	}

	if data, err := os.ReadFile(fileName); err == nil {
		return data
	}

	return fallback
}

func serveLzclawHTML(c *gin.Context, lzclawPage []byte) {
	c.Set(middleware.RouteTagKey, "web")
	c.Header("Cache-Control", "no-cache")
	c.Data(http.StatusOK, "text/html; charset=utf-8", loadRuntimeHTML("lzclaw.html", lzclawPage))
}

// func serveLzclawQRCode(c *gin.Context, lzclawQRCode []byte) {
// 	c.Set(middleware.RouteTagKey, "web")
// 	c.Header("Cache-Control", "public, max-age=3600")
// 	c.Data(http.StatusOK, mime.TypeByExtension(".jpg"), loadRuntimeFile(filepath.Join("public", "qrcode.jpg"), lzclawQRCode))
// }

func serveLzclawDownload(c *gin.Context) {
	c.Set(middleware.RouteTagKey, "web")
	setupFileName := getLZClawSetupFileName()
	filePath, err := resolveRuntimeFilePath(filepath.Join("public", setupFileName))
	if err != nil {
		controller.RelayNotFound(c)
		return
	}
	c.Header("Cache-Control", "no-cache")
	c.FileAttachment(filePath, setupFileName)
}

func getLZClawSetupFileName() string {
	return fmt.Sprintf("LZClaw-%s.exe", common.LZClawDownloadVersion)
}

func resolveRuntimeFilePath(fileName string) (string, error) {
	if executablePath, err := os.Executable(); err == nil {
		filePath := filepath.Join(filepath.Dir(executablePath), fileName)
		if _, statErr := os.Stat(filePath); statErr == nil {
			return filePath, nil
		}
	}

	if _, err := os.Stat(fileName); err == nil {
		return fileName, nil
	}

	return "", os.ErrNotExist
}

func resolveRuntimeDirPath(dirName string) string {
	if dirPath, err := resolveRuntimeFilePath(dirName); err == nil {
		return dirPath
	}
	return dirName
}
