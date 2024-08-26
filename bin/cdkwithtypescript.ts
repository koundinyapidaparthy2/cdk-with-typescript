#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkwithtypescriptStack } from "../lib/cdkwithtypescript-stack";

const app = new cdk.App();
new CdkwithtypescriptStack(app, "CdkwithtypescriptStack", {});
