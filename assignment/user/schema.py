from graphene import Mutation, ObjectType, List, Field, Int, String, ID
from graphene_django.types import DjangoObjectType
import graphql_jwt
from django.contrib.auth import get_user_model


User = get_user_model()

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'last_login',
            'email',
        )


class Query(ObjectType):
    users = List(UserType)
    user = Field(UserType, id=Int())
    me = Field(UserType)
    
    @staticmethod
    def resolve_users(self, info, **kwargs):
        return User.objects.all()
    
    @staticmethod
    def resolve_user(self, info, id):
        return User.objects.get(id=id)
    
    @staticmethod
    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Please login first.')
        return user



class CreateUser(Mutation):
    id = ID()
    email = String()
    username = String()
    first_name = String()
    last_name = String()
    
    class Arguments:
        email = String(required=True)
        username = String()
        password = String(required=True)
        first_name = String(required=True)
        last_name = String()

    @staticmethod
    def mutate(_, info, email, password, first_name, last_name):
        username = email.split('@')[0]
        user = User.objects.create_user(email=email,
                                        username=username,
                                        password=password,
                                        first_name=first_name,
                                        last_name=last_name)        
        return CreateUser(
            id=user.id,
            email=user.email,
            username=username,
            first_name=user.first_name,
            last_name=user.last_name)


class Mutation(ObjectType):
    create_user = CreateUser.Field()
    login = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()