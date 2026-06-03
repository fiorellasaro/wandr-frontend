package com.wandr.app;

import android.Manifest;

import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

@CapacitorPlugin(
    name = "AndroidLocationPermission",
    permissions = {
        @Permission(strings = { Manifest.permission.ACCESS_COARSE_LOCATION }, alias = "coarseLocation"),
        @Permission(strings = { Manifest.permission.ACCESS_FINE_LOCATION }, alias = "fineLocation")
    }
)
public class AndroidLocationPermissionPlugin extends Plugin {}
