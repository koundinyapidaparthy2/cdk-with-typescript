import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as S3 from "aws-cdk-lib/aws-s3";
import * as gateway from "aws-cdk-lib/aws-apigatewayv2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as integration from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class analyticsStack extends cdk.Stack {
  constructor(constuct: Construct, id: string, props?: cdk.StackProps) {
    super(constuct, id, props);
    const analyticsLambdaFns = new lambda.Function(this, "analyticsLambda", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "todo-lamdafns.handler",
      code: lambda.Code.fromAsset("lib/handlers"),
      functionName: "analytics",
    });
    const analyticsBucket = new S3.Bucket(this, "analyticsBucket", {
      bucketName: "analytics",
    });
    const analyticsGateway = new gateway.HttpApi(this, "analyticsGateway", {
      apiName: "analytics",
      corsPreflight: {
        allowMethods: [gateway.CorsHttpMethod.ANY],
      },
    });
    const analyticsDb = new dynamodb.TableV2(this, "analyticsDb", {
      tableName: "analytics",
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // analyticsDb.grantReadWriteData(analyticsLambdaFns);
    // analyticsBucket.grantReadWrite(analyticsLambdaFns);
    analyticsLambdaFns.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:*", "s3:*"],
        resources: [analyticsDb.tableArn, analyticsBucket.bucketArn],
        effect: iam.Effect.ALLOW,
      })
    );
    analyticsGateway.addRoutes({
      path: "/analytics",
      methods: [gateway.HttpMethod.ANY],
      integration: new integration.HttpLambdaIntegration(
        "analyticsLambdaFns",
        analyticsLambdaFns
      ),
    });
  }
}
