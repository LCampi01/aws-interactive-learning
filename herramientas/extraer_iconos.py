"""Genera fuente/iconos.js a partir del paquete oficial "AWS Architecture Icons".

Uso:  python -I herramientas/extraer_iconos.py RUTA/Icon-package_XXXX.zip

El paquete se descarga de https://aws.amazon.com/architecture/icons/ . Los iconos son de
Amazon Web Services; AWS permite usarlos para crear diagramas de arquitectura.
Solo se leen archivos .svg del zip; no se ejecuta ni se extrae nada más.
"""
import base64
import io
import os
import re
import sys
import zipfile

A = "Architecture-Service-Icons"
R = "Resource-Icons"

# clave del servicio en fuente/servicios.js -> (familia, carpeta, nombre de archivo sin sufijo)
MAPA = {
    "ec2": (A, "Arch_Compute", "Arch_Amazon-EC2"),
    "asg": (A, "Arch_Compute", "Arch_Amazon-EC2-Auto-Scaling"),
    "lambda": (A, "Arch_Compute", "Arch_AWS-Lambda"),
    "batch": (A, "Arch_Compute", "Arch_AWS-Batch"),
    "beanstalk": (A, "Arch_Compute", "Arch_AWS-Elastic-Beanstalk"),
    "lightsail": (A, "Arch_Compute", "Arch_Amazon-Lightsail"),
    "ecs": (A, "Arch_Containers", "Arch_Amazon-Elastic-Container-Service"),
    "eks": (A, "Arch_Containers", "Arch_Amazon-Elastic-Kubernetes-Service"),
    "fargate": (A, "Arch_Containers", "Arch_AWS-Fargate"),
    "ecr": (A, "Arch_Containers", "Arch_Amazon-Elastic-Container-Registry"),
    "s3": (A, "Arch_Storage", "Arch_Amazon-Simple-Storage-Service"),
    "ebs": (A, "Arch_Storage", "Arch_Amazon-Elastic-Block-Store"),
    "efs": (A, "Arch_Storage", "Arch_Amazon-EFS"),
    "glacier": (A, "Arch_Storage", "Arch_Amazon-Simple-Storage-Service-Glacier"),
    "fsx": (A, "Arch_Storage", "Arch_Amazon-FSx"),
    "backup": (A, "Arch_Storage", "Arch_AWS-Backup"),
    "rds": (A, "Arch_Databases", "Arch_Amazon-RDS"),
    "aurora": (A, "Arch_Databases", "Arch_Amazon-Aurora"),
    "dynamodb": (A, "Arch_Databases", "Arch_Amazon-DynamoDB"),
    "elasticache": (A, "Arch_Databases", "Arch_Amazon-ElastiCache"),
    "memorydb": (A, "Arch_Databases", "Arch_Amazon-MemoryDB"),
    "documentdb": (A, "Arch_Databases", "Arch_Amazon-DocumentDB"),
    "neptune": (A, "Arch_Databases", "Arch_Amazon-Neptune"),
    "keyspaces": (A, "Arch_Databases", "Arch_Amazon-Keyspaces"),
    "timestream": (A, "Arch_Databases", "Arch_Amazon-Timestream"),
    "vpc": (A, "Arch_Networking-Content-Delivery", "Arch_Amazon-Virtual-Private-Cloud"),
    "r53": (A, "Arch_Networking-Content-Delivery", "Arch_Amazon-Route-53"),
    "cloudfront": (A, "Arch_Networking-Content-Delivery", "Arch_Amazon-CloudFront"),
    "apigw": (A, "Arch_Networking-Content-Delivery", "Arch_Amazon-API-Gateway"),
    "privatelink": (A, "Arch_Networking-Content-Delivery", "Arch_AWS-PrivateLink"),
    "dx": (A, "Arch_Networking-Content-Delivery", "Arch_AWS-Direct-Connect"),
    "tgw": (A, "Arch_Networking-Content-Delivery", "Arch_AWS-Transit-Gateway"),
    "igw": (R, "Res_Networking-Content-Delivery", "Res_Amazon-VPC_Internet-Gateway"),
    "nat": (R, "Res_Networking-Content-Delivery", "Res_Amazon-VPC_NAT-Gateway"),
    "alb": (R, "Res_Networking-Content-Delivery", "Res_Elastic-Load-Balancing_Application-Load-Balancer"),
    "nlb": (R, "Res_Networking-Content-Delivery", "Res_Elastic-Load-Balancing_Network-Load-Balancer"),
    "sqs": (A, "Arch_Application-Integration", "Arch_Amazon-Simple-Queue-Service"),
    "sns": (A, "Arch_Application-Integration", "Arch_Amazon-Simple-Notification-Service"),
    "eventbridge": (A, "Arch_Application-Integration", "Arch_Amazon-EventBridge"),
    "sfn": (A, "Arch_Application-Integration", "Arch_AWS-Step-Functions"),
    "mq": (A, "Arch_Application-Integration", "Arch_Amazon-MQ"),
    "ses": (A, "Arch_Business-Applications", "Arch_Amazon-Simple-Email-Service"),
    "kds": (A, "Arch_Analytics", "Arch_Amazon-Kinesis-Data-Streams"),
    "msk": (A, "Arch_Analytics", "Arch_Amazon-Managed-Streaming-for-Apache-Kafka"),
    "firehose": (A, "Arch_Analytics", "Arch_Amazon-Data-Firehose"),
    "glue": (A, "Arch_Analytics", "Arch_AWS-Glue"),
    "athena": (A, "Arch_Analytics", "Arch_Amazon-Athena"),
    "emr": (A, "Arch_Analytics", "Arch_Amazon-EMR"),
    "redshift": (A, "Arch_Analytics", "Arch_Amazon-Redshift"),
    "flink": (A, "Arch_Analytics", "Arch_Amazon-Managed-Service-for-Apache-Flink"),
    "lakeformation": (A, "Arch_Analytics", "Arch_AWS-Lake-Formation"),
    "opensearch": (A, "Arch_Analytics", "Arch_Amazon-OpenSearch-Service"),
    "quicksight": (A, "Arch_Business-Applications", "Arch_Amazon-Quick"),
    "quick": (A, "Arch_Business-Applications", "Arch_Amazon-Quick"),
    "bedrock": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Bedrock"),
    "agentcore": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Bedrock-AgentCore"),
    "sagemaker": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-SageMaker-AI"),
    "rekognition": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Rekognition"),
    "textract": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Textract"),
    "transcribe": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Transcribe"),
    "comprehend": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Comprehend"),
    "polly": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Polly"),
    "translate": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Translate"),
    "lex": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Lex"),
    "personalize": (A, "Arch_Artificial-Intelligence", "Arch_Amazon-Personalize"),
    "iam": (A, "Arch_Security-Identity", "Arch_AWS-Identity-and-Access-Management"),
    "idc": (A, "Arch_Security-Identity", "Arch_AWS-IAM-Identity-Center"),
    "kms": (A, "Arch_Security-Identity", "Arch_AWS-Key-Management-Service"),
    "secrets": (A, "Arch_Security-Identity", "Arch_AWS-Secrets-Manager"),
    "acm": (A, "Arch_Security-Identity", "Arch_AWS-Certificate-Manager"),
    "cognito": (A, "Arch_Security-Identity", "Arch_Amazon-Cognito"),
    "waf": (A, "Arch_Security-Identity", "Arch_AWS-WAF"),
    "shield": (A, "Arch_Security-Identity", "Arch_AWS-Shield"),
    "guardduty": (A, "Arch_Security-Identity", "Arch_Amazon-GuardDuty"),
    "cloudtrail": (A, "Arch_Management-Tools", "Arch_AWS-CloudTrail"),
    "cloudwatch": (A, "Arch_Management-Tools", "Arch_Amazon-CloudWatch"),
    "organizations": (A, "Arch_Management-Tools", "Arch_AWS-Organizations"),
    "cloudformation": (A, "Arch_Management-Tools", "Arch_AWS-CloudFormation"),
    "ssm": (A, "Arch_Management-Tools", "Arch_AWS-Systems-Manager"),
    "xray": (A, "Arch_Developer-Tools", "Arch_AWS-X-Ray"),
    "cdk": (A, "Arch_Developer-Tools", "Arch_AWS-Cloud-Development-Kit"),
    "codepipeline": (A, "Arch_Developer-Tools", "Arch_AWS-CodePipeline"),
    "codebuild": (A, "Arch_Developer-Tools", "Arch_AWS-CodeBuild"),
    "codedeploy": (A, "Arch_Developer-Tools", "Arch_AWS-CodeDeploy"),
}


def reducir(svg):
    """Quita cabecera, título, espacios y atributos que no afectan al dibujo."""
    svg = re.sub(r"<\?xml[^>]*\?>", "", svg)
    svg = re.sub(r"<title>.*?</title>", "", svg, flags=re.S)
    svg = re.sub(r"<desc>.*?</desc>", "", svg, flags=re.S)
    if "url(#" not in svg and "xlink:href" not in svg:
        svg = re.sub(r'\s+id="[^"]*"', "", svg)
        svg = re.sub(r'\s+xmlns:xlink="[^"]*"', "", svg)
    svg = re.sub(r'\s+version="1\.1"', "", svg)
    svg = re.sub(r">\s+<", "><", svg)
    svg = re.sub(r"\s+", " ", svg).strip()
    if "<script" in svg.lower() or "onload=" in svg.lower():
        raise ValueError("SVG con código ejecutable: no se incluye")
    return svg


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    z = zipfile.ZipFile(sys.argv[1])
    nombres = [n for n in z.namelist() if n.endswith(".svg") and not n.startswith("__MACOSX")]
    salida, faltan, total = [], [], 0
    for clave, (familia, carpeta, base) in MAPA.items():
        if familia == A:
            sufijo = "/%s/48/%s_48.svg" % (carpeta, base)
        else:
            sufijo = "/%s/%s_48.svg" % (carpeta, base)
        hallados = [n for n in nombres if n.startswith(familia) and n.endswith(sufijo)]
        if not hallados:
            faltan.append(clave)
            continue
        svg = reducir(z.read(hallados[0]).decode("utf-8"))
        total += len(svg)
        b64 = base64.b64encode(svg.encode("utf-8")).decode("ascii")
        salida.append(' %s:"data:image/svg+xml;base64,%s"' % (clave, b64))
    recursos = sorted(k for k, v in MAPA.items() if v[0] == R)
    texto = (
        "/* ---------- Iconos oficiales: AWS Architecture Icons (© Amazon Web Services). Generado por herramientas/extraer_iconos.py ---------- */\n"
        "const ICONS={\n" + ",\n".join(salida) + "\n};\n"
        "// iconos de recurso: trazo de color sobre fondo transparente, sin el cuadrado de servicio\n"
        "const ICON_RES=new Set(%s);\n" % repr(recursos).replace("'", '"')
    )
    aqui = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    destino = os.path.join(aqui, "fuente", "iconos.js")
    io.open(destino, "w", encoding="utf-8", newline="\n").write(texto)
    print("%d iconos, %d KB de SVG, %d KB en iconos.js" % (len(salida), total // 1024, len(texto) // 1024))
    if faltan:
        print("No encontrados en el paquete:", ", ".join(faltan))


if __name__ == "__main__":
    main()
