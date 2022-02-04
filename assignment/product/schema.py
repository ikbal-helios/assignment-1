import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from graphql_jwt.decorators import login_required

from .models import Product, Image


user_model = get_user_model()


class ProductImageType(DjangoObjectType):
    class Meta:
        model = Image
        fields = "__all__"

class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ('id', 'title', 'files', 'user')
    
    files = graphene.List(ProductImageType)

    def resolve_files(value_obj, info):
        return value_obj.files.all()


class ProductImageMutation(graphene.Mutation):
    id = graphene.ID()
    image = graphene.String()
    success = graphene.Boolean()
    class Arguments:
        image_file = Upload(required=True)
    
    @login_required
    def mutate(self, info, image_file):
        img = Image.objects.create(image = image_file, user = info.context.user)
        return ProductImageMutation(
            success = True,
            id = img.id,
            image = img.image
        )
    


class ProductMutation(graphene.Mutation):
    id = graphene.ID()
    files = graphene.List(ProductImageType)
    title = graphene.String()
    success = graphene.Boolean()
    class Arguments:
        title = graphene.String(required = True)
        input_files = graphene.List(graphene.ID, required = True)

    @login_required
    def mutate(self, info, title, input_files):
        product = Product(
            title = title,
            user = info.context.user
        )
        product.save()
        for file in input_files:
            product.files.add(Image.objects.get(pk=file))
        product.save()
        return ProductMutation(success=True, id=product.id, title=product.title, files=product.files.all())


class DeleteMutation(graphene.Mutation):
    success = graphene.Boolean()
    class Arguments:
        id = graphene.ID(required = True)

    @login_required
    def mutate(self, info, id):
        try:
            product = Product.objects.get(pk=id)
            product.delete()
        except Product.DoesNotExist:
            raise Exception('No product found containing this id!')
        return DeleteMutation(success=True)


class Query(graphene.ObjectType):
    images = graphene.List(ProductImageType)
    products_by_user = graphene.List(ProductType)
    product_by_id = graphene.Field(ProductType, id=graphene.ID())

    @login_required
    def resolve_images(root, info):
        return info.context.user.images.all()

    @login_required
    def resolve_products_by_user(root, info):
        return info.context.user.products.all()
    
    @login_required
    def resolve_product_by_id(root, info, id):
        try:
            return Product.objects.get(pk=id)
        except Product.DoesNotExist:
            return None


class Mutation(graphene.ObjectType):
    add_image = ProductImageMutation.Field()
    add_product = ProductMutation.Field()
    delete_product = DeleteMutation.Field()