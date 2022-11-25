
CWD = $(shell pwd)

BACKAND_DIR := $(CWD)/DB
BACKAND_BINARY := $(BACKAND_DIR)/bin/db_exe
FRONTEND_DIR := $(CWD)/Frontend/db
FRONTEND_BUILD_DIR := $(FRONTEND_DIR)/build
FRONTEND_MODULES_LOCK_DIR := $(FRONTEND_DIR)/yarn.lock
FRONTEND_DEPLOY_DIR := $(BACKAND_DIR)/frontend_build


deploy: $(FRONTEND_DEPLOY_DIR) $(BACKAND_BINARY)
	$(MAKE) -C $(BACKAND_DIR) build
	$(BACKAND_BINARY) --dir $(BACKAND_DIR)

prepare_deploy: $(FRONTEND_DEPLOY_DIR)

$(FRONTEND_DEPLOY_DIR): $(FRONTEND_BUILD_DIR)
	rm -rf $(FRONTEND_DEPLOY_DIR)
	cp -r $(FRONTEND_BUILD_DIR) $(FRONTEND_DEPLOY_DIR)
	@echo "[ Frontend ]: successfully deployed"

$(FRONTEND_MODULES_LOCK_DIR): $(FRONTEND_DIR)/package.json
	yarn --cwd $(FRONTEND_DIR)
	@echo "[ Frontend ]: required modules installed"

$(FRONTEND_BUILD_DIR): $(FRONTEND_MODULES_LOCK_DIR)
	yarn --cwd $(FRONTEND_DIR) build
	@echo "[ Frontend ]: frontend built to deployment files"

# TODO: Make dependent on all js/jsx/css/html files and remove .PHONY
.PHONY: $(FRONTEND_BUILD_DIR)

.PHONY: prepare_deploy deploy



