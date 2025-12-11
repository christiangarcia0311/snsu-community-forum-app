from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0004_userotp'),
    ]

    operations = [
        migrations.AddField(
            model_name='userotp',
            name='secret',
            field=models.CharField(max_length=128, null=True, blank=True),
        ),
    ]
