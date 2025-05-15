from django.urls import path, include
from rest_framework import routers
from .views import *

router = routers.DefaultRouter()

# Example route
router.register(r'example', ExampleView, basename='example')

# Authentication & Login

router.register(r'admin/login', AdminLoginView, basename='admin-login')

# Cinema Management

router.register(r'admin/cinemas', CinemaView, basename='cinemas')
router.register(r'admin/cinemas/employees', CinemaEmployeeView, basename='cinema-admin-employees')

# Employee Management

router.register(r'admin/employees', EmployeeView, basename='employees')

# Client Management

router.register(r'admin/clients', AdminClientView, basename='admin-clients')

# Movie Management

router.register(r'admin/movies', MovieView, basename='movies')

# Reports

router.register(r'admin/reports', ReportView, basename='reports')

# Admin & Manager Routes

    # Session Management

router.register(r'sessions', SessionView, basename='sessions')

# Cinema Room Management

router.register(r'cinema/rooms', RoomView, basename='cinema-rooms')

# Cinema Employee Management

router.register(r'cinema/employees', CinemaEmployeeView, basename='cinema-employees')

# Cinema Reports

router.register(r'cinema/reports', CinemaReportView, basename='cinema-reports')

# Client Routes

    # Authentication & Login

router.register(r'client/login', ClientLoginView, basename='client-login')

# Client Registration & Profile Management

router.register(r'client/register', ClientRegisterView, basename='client-register')
router.register(r'client/profile', ClientProfileView, basename='client-profile')

# Client Points & Orders

router.register(r'client/points', ClientPointsView, basename='client-points')
router.register(r'client/orders', ClientOrderView, basename='client-orders')

# Totem Routes

    # Cinema & Movie Listings

router.register(r'totem/cinemas', TotemCinemaView, basename='totem-cinemas')
router.register(r'totem/movies', TotemMovieView, basename='totem-movies')
# router.register(r'totem/movies/<str:cnpj>', TotemMovieView, basename='totem-movies')
# router.register(r'totem/movies/<str:cnpj>/<str:dia>', TotemMovieView, basename='totem-movies-dia')
# router.register(r'totem/movies/<str:cnpj>/<str:dia>/<str:filme_id>', TotemMovieView, basename='totem-movies-dia-filme')

# Session & Seat Selection

router.register(r'totem/sessions', TotemSessionView, basename='totem-sessions')
router.register(r'totem/seats', TotemSeatView, basename='totem-seats')

# Ticket & Payment

router.register(r'totem/tickets', TotemTicketView, basename='totem-tickets')
router.register(r'totem/payment', TotemPaymentView, basename='totem-payment')


urlpatterns = [
    # path('clients/', views.get_all_clients, name='get_all_clients'),
    # path('ingressos/<str:cpf>/', views.get_ingressos_by_cliente, name='get_ingressos_by_cliente'),
    path('', include(router.urls)),
]
