package com.model;

public class Message {
    private String userName;
    private String content;
    private Action action;

    public Message() {}

    public Message(String userName, String content, Action action) {
        this.userName = userName;
        this.content = content;
        this.action = action;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
    }

    @Override
    public String toString() {
        return "Message{" +
                "userName='" + userName + '\'' +
                ", content='" + content + '\'' +
                ", action=" + action +
                '}';
    }
}
