output "codestar_connection_arn" {
  description = "ARN of the CodeStar connection to GitHub. Must be activated (PENDING -> AVAILABLE) in the AWS console before the pipeline can run."
  value       = aws_codestarconnections_connection.github.arn
}
