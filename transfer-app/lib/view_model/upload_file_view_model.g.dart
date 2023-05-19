// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'upload_file_view_model.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$UploadFileViewModel on UploadFileViewModelBase, Store {
  late final _$uploadAmountAtom =
      Atom(name: 'UploadFileViewModelBase.uploadAmount', context: context);

  @override
  double get uploadAmount {
    _$uploadAmountAtom.reportRead();
    return super.uploadAmount;
  }

  @override
  set uploadAmount(double value) {
    _$uploadAmountAtom.reportWrite(value, super.uploadAmount, () {
      super.uploadAmount = value;
    });
  }

  late final _$UploadFileViewModelBaseActionController =
      ActionController(name: 'UploadFileViewModelBase', context: context);

  @override
  void updateUploadAmount(double num) {
    final _$actionInfo = _$UploadFileViewModelBaseActionController.startAction(
        name: 'UploadFileViewModelBase.updateUploadAmount');
    try {
      return super.updateUploadAmount(num);
    } finally {
      _$UploadFileViewModelBaseActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
uploadAmount: ${uploadAmount}
    ''';
  }
}
