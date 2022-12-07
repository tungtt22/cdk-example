/* eslint-disable no-restricted-syntax */
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 1,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'private-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
    });

    // 👇 update the Name tag for the VPC
    cdk.Aspects.of(vpc).add(new cdk.Tag('Name', 'my-cdk-vpc'));

    // 👇 update the Name tag for public subnets
    for (const subnet of vpc.publicSubnets) {
      cdk.Aspects.of(subnet).add(
        new cdk.Tag(
          'Name',
          `${vpc.node.id}-${subnet.node.id.replace(/Subnet[0-9]$/, '')}-${
            subnet.availabilityZone
          }`,
        ),
      );
    }

    // 👇 update the Name tag for private subnets
    for (const subnet of vpc.privateSubnets) {
      cdk.Aspects.of(subnet).add(
        new cdk.Tag(
          'Name',
          `${vpc.node.id}-${subnet.node.id.replace(/Subnet[0-9]$/, '')}-${
            subnet.availabilityZone
          }`,
        ),
      );
    }

    // 👇 update the Name tag for private subnets
    for (const subnet of vpc.isolatedSubnets) {
      cdk.Aspects.of(subnet).add(
        new cdk.Tag(
          'Name',
          `${vpc.node.id}-${subnet.node.id.replace(/Subnet[0-9]$/, '')}-${
            subnet.availabilityZone
          }`,
        ),
      );
    }

    // 👇 Create a SG for a web server
    const webserverSG = new ec2.SecurityGroup(this, 'web-server-sg', {
      vpc,
      allowAllOutbound: true,
      description: 'security group for a web server',
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    const listIPIngress = [
      '123.123.123.0/24',
      '123.13.13.0/24',
      '123.13.1.0/24',
      '123.1.3.0/24',
      '123.1.2.0/24',
    ];

    for (const ip of listIPIngress) {
      console.log(ip);
      webserverSG.addIngressRule(
        ec2.Peer.ipv4(ip),
        ec2.Port.allIcmp(),
        'allow ICMP traffic from a specific IP range',
      );
    }
    new cdk.CfnOutput(this, 'vpcId', {
      value: vpc.vpcId,
      description: 'the ID of the VPC',
    });
  }
}
