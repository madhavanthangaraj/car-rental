package com.example.springbootfirst.models;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "user_details")
public class RegisterDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int empId;

  private String name;

  @Column(name = "user_name")
  private String userName;

  private String email;
  private String password;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(name = "user_roles",
          joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "empId"),
          inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "roleId"))
  private Set<Roles> roles;

  public RegisterDetails() {
  }

  public RegisterDetails(int empId, String name, String userName, String email, String password, Set<Roles> roles) {
    this.empId = empId;
    this.name = name;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }

  public int getEmpId() {
    return empId;
  }

  public void setEmpId(int empId) {
    this.empId = empId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<Roles> getRoles() {
    return roles;
  }

  public void setRoles(Set<Roles> roles) {
    this.roles = roles;
  }

  @Override
  public String toString() {
    return "RegisterDetails{" +
            "empId=" + empId +
            ", name='" + name + '\'' +
            ", userName='" + userName + '\'' +
            ", email='" + email + '\'' +
            ", password='" + password + '\'' +
            ", roles=" + roles +
            '}';
  }
}
