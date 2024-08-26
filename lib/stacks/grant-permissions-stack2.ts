import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
export class GrantPermissionMethods1 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // we can also create a role and attach policy to it.

    const todo_role = new iam.Role(this, "dynamoDbAccessRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    const todo_db = new dynamodb.TableV2(this, "todo-list", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });
    const todo_fns = new lambda.Function(this, "todo-fns", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "todo-lambdafns.handler",
      code: lambda.Code.fromAsset("/lib/handlers"),
    });

    // Traditional way

    // todo_fns.addToRolePolicy(
    //   new iam.PolicyStatement({
    //     actions: ["dynmodb:*"],
    //     resources: [todo_db.tableArn],
    //     effect: iam.Effect.ALLOW,
    //   })
    // );

    // Modern Way

    // const grant = todo_db.grantReadWriteData(todo_fns);
    // todo_db.node.addDependency(grant);
  }
}
