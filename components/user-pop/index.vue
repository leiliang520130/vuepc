<template>
  <Popup
    ref="popRef"
    @close="appStore.toShowUserPop()"
    confirm-button-text=""
    cancel-button-text=""
    title="个人信息"
  >
    <div>
      <el-form label-width="90px">
        <el-form-item label="用户头像">
          <div class="avatar">
            <ElAvatar :size="60" :src="userInfo?.avatar"></ElAvatar>
            <div class="change-btn">
              <CropperUpload
                @change="setUserInfo($event, UserFieldEnum.AVATAR)"
              >
                <span class="text-xs text-white">修改</span>
              </CropperUpload>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="用户ID">
          <div>
            {{ userInfo.sn }}
            <ClientOnly>
              <PopoverInput
                class="inline-block"
                @confirm="setUserInfo($event, UserFieldEnum.USERNAME)"
                :limit="30"
                show-limit
              >
                <!-- <ElButton link>
                                    <Icon name="el-icon-Edit" :size="16" />
                                </ElButton> -->
              </PopoverInput>
            </ClientOnly>
          </div>
        </el-form-item>
        <el-form-item label="昵称">
          <div>
            {{ userInfo.nickname }}
            <ClientOnly>
              <PopoverInput
                class="inline-block"
                @confirm="setUserInfo($event, UserFieldEnum.NICKNAME)"
                :limit="30"
                show-limit
              >
                <ElButton link>
                  <Icon name="el-icon-Edit" :size="16" />
                </ElButton>
              </PopoverInput>
            </ClientOnly>
          </div>
        </el-form-item>
        <el-form-item label="性别">
          <div>
            <span>
              {{ userInfo.sex }}
            </span>
            <ClientOnly>
              <PopoverInput
                class="inline-block"
                type="select"
                :teleported="false"
                :options="[
                  {
                    label: '未知',
                    value: 0,
                  },
                  {
                    label: '男',
                    value: 1,
                  },
                  {
                    label: '女',
                    value: 2,
                  },
                ]"
                @confirm="setUserInfo($event, UserFieldEnum.SEX)"
              >
                <ElButton link>
                  <Icon name="el-icon-Edit" :size="16" />
                </ElButton>
              </PopoverInput>
            </ClientOnly>
          </div>
        </el-form-item>
        <el-form-item label="手机号">
          <div class="flex items-center">
            <div>
              {{ userInfo.mobile || "-" }}
            </div>

            <ElButton class="ml-4" link type="primary" @click="changeMobile">
              {{ userInfo.mobile ? "更换手机号" : "绑定手机号" }}
            </ElButton>
          </div>
        </el-form-item>
        <el-form-item label="邮箱账号">
          <div class="flex items-center">
            <div>
              {{ userInfo.email || "-" }}
            </div>

            <!-- <ElButton
                            class="ml-4"
                            link
                            type="primary"
                            @click="changeMobile"
                        >
                            {{ userInfo.email ? '更换手机号' : '绑定手机号' }}
                        </ElButton> -->
          </div>
        </el-form-item>
        <el-form-item label="注册时间">
          <div>
            {{ userInfo.create_time }}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElButton, ElAvatar } from "element-plus";
import { useAppStore } from "~~/stores/app";
import { getUserInfo, userEdit } from "@/api/user";
import {
  useAccount,
  PopupTypeEnum,
} from "@/layouts/components/account/useAccount";
const popRef = shallowRef();

const appStore = useAppStore();
const { setPopupType, toggleShowPopup, showPopup } = useAccount();
// 用户资料
enum UserFieldEnum {
  NONE = "",
  AVATAR = "avatar",
  USERNAME = "account",
  NICKNAME = "nickname",
  SEX = "sex",
}

const { data: userInfo, refresh } = useAsyncData(() => getUserInfo());

const setUserInfo = async (
  value: string,
  type: UserFieldEnum
): Promise<void> => {
  await userEdit({
    field: type,
    value: value,
  });
  refresh();
};

const changeMobile = () => {
  setPopupType(PopupTypeEnum.BIND_MOBILE);
  toggleShowPopup(true);
};

const open = () => {
  popRef.value.open();
  refresh();
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.avatar {
  @apply relative flex cursor-pointer;
  .change-btn {
    display: none;
    height: 50%;
    line-height: 30px;
    @apply absolute bg-[rgba(0,0,0,0.5)]  w-full text-center bottom-0 rounded-b-full;
  }
  &:hover {
    .change-btn {
      display: block;
    }
  }
}
</style>
