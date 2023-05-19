import 'dart:convert';

import 'package:auto_route/auto_route.dart';
import 'package:dio_wrapper/dio_wrapper.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';
import 'package:path/path.dart' as path;
import 'package:fson_host_app/utils/auth_manager.dart';
import 'package:fson_host_app/utils/router/app_router.dart';

import '../config.dart';

part 'main_view_model.g.dart';

class MainViewModel = MainViewModelBase with _$MainViewModel;

abstract class MainViewModelBase with Store {
  @observable
  bool roomOnline = true;

  @observable
  List<String> sharedDirectories = [];

  @observable
  bool isLoading = false;

  @observable
  MainViewModelBase() {
    init();
  }

  final http = RequestManager.instance;

  @action
  void changeLoading() {
    isLoading = !isLoading;
  }

  @action
  Future<void> init() async {
    await getHostStatus();
    await getAllDirectories();
  }

  @action
  Future<void> getHostStatus() async {
    changeLoading();
    try {
      Res? response;
      response = await http.request(
        '${AppConfig.apiUrl}/room',
        options: ReqOptions(method: HttpMethod.get.value, headers: AuthManager.instance.authHeader),
      );
      if (response != null && response.statusCode == 200) {
        roomOnline = true;
      } else {
        roomOnline = false;
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> openRoom(BuildContext context) async {
    changeLoading();
    try {
      Res? response;
      response = await http.request(
        '${AppConfig.apiUrl}/room/open',
        options: ReqOptions(method: HttpMethod.post.value, headers: AuthManager.instance.authHeader),
      );
      if (response != null && response.statusCode == 200) {
        roomOnline = true;
      } else {
        context.router.push(AuthRoute());
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> closeRoom(BuildContext context) async {
    changeLoading();
    try {
      Res? response;
      response = await http.request(
        '${AppConfig.apiUrl}/room/close',
        options: ReqOptions(method: HttpMethod.post.value, headers: AuthManager.instance.authHeader),
      );
      if (response != null && response.statusCode == 200) {
        roomOnline = false;
      } else {
        context.router.push(AuthRoute());
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> addDirectory(String newDirectory) async {
    changeLoading();
    try {
      if (newDirectory.length < 4) {
        return;
      }
      String fixedDirectory = path.Context().normalize(newDirectory);
      await http.request(
        '${AppConfig.apiUrl}/config/directory',
        data: jsonEncode({"path": fixedDirectory}),
        options: ReqOptions(method: HttpMethod.post.value, headers: AuthManager.instance.authHeader),
      );
      await getAllDirectories();
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> removeDirectory(String directory) async {
    changeLoading();
    try {
      String fixedDirectory = path.Context().normalize(directory);
      await http.request(
        '${AppConfig.apiUrl}/config/directory',
        data: jsonEncode({"path": fixedDirectory}),
        options: ReqOptions(method: HttpMethod.delete.value, headers: AuthManager.instance.authHeader),
      );
      await getAllDirectories();
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> getAllDirectories() async {
    changeLoading();
    try {
      final response = await http.request(
        '${AppConfig.apiUrl}/config/directory',
        options: ReqOptions(method: HttpMethod.get.value, headers: AuthManager.instance.authHeader),
      );
      if (response != null && response.statusCode == 200) {
        sharedDirectories = List.castFrom<dynamic, String>(response.data);
      } else {}
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> clearTemps() async {
    changeLoading();
    try {
      await http.request(
        '${AppConfig.apiUrl}/clear/temp',
        options: ReqOptions(method: HttpMethod.delete.value, headers: AuthManager.instance.authHeader),
      );
      await getAllDirectories();
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }
}
