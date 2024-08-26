import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
export class GrantPermissionMethods extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Creating lambda function
    const todo_lambda_function = new lambda.Function(
      this,
      `${id}-todo-lambdafns`,
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: "todo-lambdafns.handler",
        code: lambda.Code.fromAsset("lib/handlers"),
      }
    );

    // create dynamodb
    const todo_db = new dynamodb.TableV2(this, "todo-list", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // ? Grant Permission Method 1

    todo_lambda_function.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:*"],
        resources: [todo_db.tableArn],
        effect: iam.Effect.ALLOW,
      })
    );

    // ? Grant Permission Method 2

    todo_db.grantReadWriteData(todo_lambda_function);
  }
}
