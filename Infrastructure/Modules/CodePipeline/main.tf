

/*=======================================================
      AWS CodePipeline for build and deployment
========================================================*/

# ------- GitHub (version 2) source via a CodeStar Connection -------
# NOTE: A new connection is created in "PENDING" status. After the first apply
# you must complete the OAuth handshake in the AWS console (Developer Tools ->
# Settings -> Connections) before the pipeline can pull from GitHub.
resource "aws_codestarconnections_connection" "github" {
  name          = substr("gh-${var.github_token}", 0, 32)
  provider_type = "GitHub"
}

resource "aws_codepipeline" "aws_codepipeline" {
  name     = var.name
  role_arn = var.pipe_role

  artifact_store {
    location = var.s3_bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        ConnectionArn        = aws_codestarconnections_connection.github.arn
        FullRepositoryId     = "${var.repo_owner}/${var.repo_name}"
        BranchName           = var.branch
        OutputArtifactFormat = "CODE_ZIP"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build_server"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BuildArtifact_server"]

      configuration = {
        ProjectName = var.codebuild_project_server
      }
    }

    action {
      name             = "Build_client"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      version          = "1"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BuildArtifact_client"]
      configuration = {
        ProjectName = var.codebuild_project_client
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "Deploy_server"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeployToECS"
      input_artifacts = ["BuildArtifact_server"]
      version         = "1"

      configuration = {
        ApplicationName                = var.app_name_server
        DeploymentGroupName            = var.deployment_group_server
        TaskDefinitionTemplateArtifact = "BuildArtifact_server"
        TaskDefinitionTemplatePath     = "taskdef.json"
        AppSpecTemplateArtifact        = "BuildArtifact_server"
        AppSpecTemplatePath            = "appspec.yaml"
      }
    }

    action {
      name            = "Deploy_client"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeployToECS"
      input_artifacts = ["BuildArtifact_client"]
      version         = "1"

      configuration = {
        ApplicationName                = var.app_name_client
        DeploymentGroupName            = var.deployment_group_client
        TaskDefinitionTemplateArtifact = "BuildArtifact_client"
        TaskDefinitionTemplatePath     = "taskdef.json"
        AppSpecTemplateArtifact        = "BuildArtifact_client"
        AppSpecTemplatePath            = "appspec.yaml"
      }
    }
  }

}