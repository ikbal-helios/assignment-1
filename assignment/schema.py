from graphene import Schema
import user.schema
import product.schema


class Query(user.schema.Query, product.schema.Query):
    pass


class Mutation(user.schema.Mutation, product.schema.Mutation):
    pass


schema = Schema(query=Query, mutation=Mutation)