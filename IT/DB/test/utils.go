package test

import (
	"io/ioutil"
	"github.com/sirupsen/logrus"
)

func GetDummyLogger() *logrus.Logger {
    logger := logrus.New()
    logger.Out = ioutil.Discard
    return logger
}
