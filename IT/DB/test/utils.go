package test

import (
	"context"
	"io/ioutil"

	"github.com/sirupsen/logrus"
)

func GetDummyLogger() *logrus.Entry {
    logger := logrus.New()
    logger.Out = ioutil.Discard

    return logger.WithContext(context.Background())
}
