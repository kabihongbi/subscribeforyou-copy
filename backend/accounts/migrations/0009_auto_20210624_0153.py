# Generated by Django 3.2.4 on 2021-06-23 16:53

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_alter_user_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=20, validators=[django.core.validators.RegexValidator('[가-힣]+')], verbose_name='이름'),
        ),
        migrations.AlterField(
            model_name='user',
            name='userid',
            field=models.CharField(max_length=30, unique=True, validators=[django.core.validators.RegexValidator('[a-z0-9_]+', 'only valid userid is required')], verbose_name='아이디'),
        ),
    ]