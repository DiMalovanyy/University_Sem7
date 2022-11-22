package grpc

import (
	"context"

	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/peer"
)

func getContextLogger(ctx context.Context, baseLogger *logrus.Entry) *logrus.Entry {
    p, _ := peer.FromContext(ctx)
    address := p.Addr.String()
    return baseLogger.WithFields(logrus.Fields{"client": address})
}
