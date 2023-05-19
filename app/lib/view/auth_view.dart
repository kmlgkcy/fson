import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../../gen/translations.g.dart';
import '../utils/router/app_router.dart';
import '../view_model/auth_view_model.dart';

class AuthView extends StatefulWidget {
  const AuthView({super.key});

  @override
  State<AuthView> createState() => _AuthViewState();
}

class _AuthViewState extends State<AuthView> {
  final _viewModel = AuthViewModel();
  final pwdController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey,
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Card(
              child: SizedBox(
            width: 320,
            child: Padding(
              padding: const EdgeInsets.all(32.0),
              child: Observer(builder: (context) => _viewModel.isLoading ? const CircularProgressIndicator() : signForm(context)),
            ),
          )),
        ],
      ),
    );
  }

  Form signForm(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(t.title.auth),
          const Divider(),
          PasswordField(controller: pwdController, label: t.title.password),
          const Divider(),
          ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                _viewModel.changeLoading();
                final response = await _viewModel.request(pwdController.text);
                _viewModel.changeLoading();
                if (context.mounted) {
                  response
                      ? context.router.replace(const MainRoute())
                      : showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: Text(t.title.error),
                              content: Text(_viewModel.message),
                            );
                          });
                }
              }
            },
            child: Text(t.action.login),
          ),
        ],
      ),
    );
  }
}

class PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String label;

  const PasswordField({
    Key? key,
    required this.controller,
    required this.label,
  }) : super(key: key);

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool isObsecure = true;
  void changeObsecure() {
    isObsecure = !isObsecure;
  }

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      textInputAction: TextInputAction.done,
      obscureText: isObsecure,
      keyboardType: TextInputType.visiblePassword,
      controller: widget.controller,
      autofillHints: const {AutofillHints.password},
      decoration: InputDecoration(
          border: const OutlineInputBorder(),
          labelText: widget.label,
          suffixIcon: IconButton(
            icon: Icon(isObsecure ? Icons.visibility_outlined : Icons.visibility_off_outlined),
            onPressed: () {
              setState(() {
                changeObsecure();
              });
            },
          )),
      validator: (val) {
        if (val == null) {
          return t.message.cannot_be_null(field: widget.label);
        }
        if (val.length < 4) {
          return t.message.min_character(field: widget.label, length: 4);
        }
        if (val.length > 16) {
          return t.message.max_character(field: widget.label, length: 16);
        }
        return null;
      },
    );
  }
}
