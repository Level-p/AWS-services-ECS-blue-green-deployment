

resource "aws_sns_topic" "sns_notifications" {
  name = var.sns_name
}