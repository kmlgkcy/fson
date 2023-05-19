import 'package:flutter/foundation.dart';
import 'package:mobx/mobx.dart';

import '../../../gen/translations.g.dart';
import '../utils/auth_manager.dart';

part 'auth_view_model.g.dart';

class AuthViewModel = AuthViewModelBase with _$AuthViewModel;

abstract class AuthViewModelBase with Store {
  final auth = AuthManager.instance;

  @observable
  bool isLoading = false;

  String message = t.message.unexpected;

  @action
  void changeLoading() {
    isLoading = !isLoading;
  }

  @action
  Future<bool> request(String password) async {
    try {
      return await auth.authenticate(password);
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
      return false;
    }
  }
}
