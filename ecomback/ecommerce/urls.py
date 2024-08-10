from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import CustomAuthToken

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'addresses', views.AddressViewSet, basename='address')
router.register(r'categories', views.CategoryViewSet)
router.register(r'products', views.ProductViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'payments', views.PaymentViewSet, basename='payment')
router.register(r'reviews', views.ReviewViewSet)
router.register(r'carts', views.CartViewSet, basename='cart')
router.register(r'coupons', views.CouponViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/token/', CustomAuthToken.as_view(), name='api_token_auth'),
]
