import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';

import '../../view/auth_view.dart';
import '../../view/main_view.dart';
import 'guards/auth_guard.dart';

part 'app_router.gr.dart';

@MaterialAutoRouter(
  replaceInRouteName: 'View,Route',
  routes: <AutoRoute>[
    AutoRoute(page: MainView, path: '/', guards: [AuthGuard], initial: true),
    AutoRoute(page: AuthView, path: '/auth'),
  ],
)
// extend the generated private router
class AppRouter extends _$AppRouter {
  AppRouter({required super.authGuard});
}
