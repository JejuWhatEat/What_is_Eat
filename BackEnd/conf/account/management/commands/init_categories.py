# account/management/commands/init_categories.py
from django.core.management.base import BaseCommand
from account.models import FoodCategory

class Command(BaseCommand):
    def handle(self, *args, **options):
        categories = [
            (0, '분식'),
            (1, '양식'),
            (2, '중식'),
            (3, '한식'),
            (4, '일식'),
        ]

        for category_id, name in categories:
            FoodCategory.objects.get_or_create(
                category_id=category_id,
                category_name=name
            )
            self.stdout.write(self.style.SUCCESS(f'Created category: {name}'))